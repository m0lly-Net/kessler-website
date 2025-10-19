// sheet-dispatcher.js (ajout data-sheet-prefix / data-sheet-suffix)
(function (global) {
  'use strict';

  function csvToArray(text) {
    const rows = [];
    const lines = text.split(/\r\n|\n|\r/);
    for (let line of lines) {
      if (line.length === 0) continue;
      const row = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === ',' && !inQuotes) {
          row.push(cur);
          cur = '';
        } else {
          cur += ch;
        }
      }
      row.push(cur);
      rows.push(row);
    }
    return rows;
  }

  function a1ToIndexes(a1) {
    const m = /^([A-Za-z]+)(\d+)$/.exec(a1.trim());
    if (!m) return null;
    const colLetters = m[1].toUpperCase();
    const rowNum = parseInt(m[2], 10);
    let colNum = 0;
    for (let i = 0; i < colLetters.length; i++) {
      colNum = colNum * 26 + (colLetters.charCodeAt(i) - 64);
    }
    return { row: rowNum - 1, col: colNum - 1 };
  }

  function colLetterToIndex(letter) {
    if (!letter) return null;
    let col = 0;
    const s = letter.trim().toUpperCase();
    for (let i = 0; i < s.length; i++) {
      col = col * 26 + (s.charCodeAt(i) - 64);
    }
    return col - 1;
  }

  function formatValue(value, format, el) {
    const v = (value == null) ? '' : String(value).trim();
    if (!format) return v || 'N/A';

    if (format === 'percent') {
      const numeric = v.replace(/[^\d.\-]/g, '');
      return numeric ? `+${numeric}%` : (v || 'N/A');
    }
    if (format === 'raw') return v || 'N/A';

    if (format === 'currency') {
      const numeric = v.replace(/[^\d.\-]/g, '');
      if (!numeric) return v || 'N/A';
      const symbol = (el && el.getAttribute && el.getAttribute('data-sheet-currency')) || '€';
      const pos = (el && el.getAttribute && el.getAttribute('data-sheet-currency-pos')) || 'after';
      const locale = (el && el.getAttribute && el.getAttribute('data-sheet-locale')) || 'fr-FR';
      const decimalsAttr = (el && el.getAttribute && el.getAttribute('data-sheet-decimals'));
      const decimals = (decimalsAttr != null) ? parseInt(decimalsAttr, 10) : 0;

      let numFormatted;
      try {
        numFormatted = new Intl.NumberFormat(locale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }).format(Number(numeric));
      } catch (e) {
        numFormatted = numeric;
      }
      return pos === 'before' ? `${symbol}${numFormatted}` : `${numFormatted}${symbol}`;
    }

    // fallback
    return v || 'N/A';
  }

  // applique prefix/suffix (évite doublons et remplace espace initial du suffix par NBSP)
  function applyAffixes(display, el) {
    if (!el) return display;
    let out = display == null ? '' : String(display);

    const prefix = el.getAttribute && el.getAttribute('data-sheet-prefix');
    const suffix = el.getAttribute && el.getAttribute('data-sheet-suffix');

    if (prefix) {
      // n'ajoute que si la valeur ne commence pas déjà par le prefix
      if (!out.startsWith(prefix)) {
        out = prefix + out;
      }
    }

    if (suffix) {
      // si suffix commence par espace, utiliser espace insécable
      let suf = suffix;
      if (suf[0] === ' ') suf = '\u00A0' + suf.slice(1);
      // n'ajoute que si la valeur ne termine pas déjà par le suffix (trimmed)
      if (!out.endsWith(suf) && !out.endsWith(suffix)) {
        out = out + suf;
      }
    }

    return out;
  }

  const SheetDispatcher = {
    _table: null,
    _ready: false,
    _error: null,

    init: async function (opts) {
      if (!opts || !opts.url) throw new Error('SheetDispatcher.init requires an URL (opts.url).');
      const url = opts.url;
      const cache = opts.cache || 'no-store';
      const autoDispatch = (opts.autoDispatch === undefined) ? true : !!opts.autoDispatch;

      try {
        const res = await fetch(url, { cache });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const text = await res.text();
        this._table = csvToArray(text);
        this._ready = true;
        this._error = null;
        if (autoDispatch) this._autoDispatch();
      } catch (e) {
        console.error('SheetDispatcher fetch/parse error:', e);
        this._table = null;
        this._ready = false;
        this._error = e;
      }
    },

    getCell: function (a1) {
      if (!this._ready || !this._table) return null;
      const pos = a1ToIndexes(a1);
      if (!pos) return null;
      return (this._table[pos.row] && this._table[pos.row][pos.col] !== undefined)
        ? this._table[pos.row][pos.col] : null;
    },

    getColumn: function (colLetter) {
      if (!this._ready || !this._table) return [];
      const c = colLetterToIndex(colLetter);
      if (c === null || isNaN(c)) return [];
      const out = [];
      for (let r = 0; r < this._table.length; r++) {
        out.push(this._table[r][c] !== undefined ? this._table[r][c] : null);
      }
      return out;
    },

    getFromColumnByIndex: function (colLetter, index) {
      const col = this.getColumn(colLetter);
      if (index < 0 || index >= col.length) return null;
      return col[index];
    },

    _autoDispatch: function () {
      if (!this._ready) return;
      const self = this;

      function setElem(el, rawVal, format) {
        let display = formatValue(rawVal, format, el);
        display = applyAffixes(display, el);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) {
          el.value = display;
        } else {
          el.textContent = display;
        }
      }

      const nodesA1 = document.querySelectorAll('[data-sheet]');
      nodesA1.forEach((el) => {
        const a1 = el.getAttribute('data-sheet').trim();
        const fmt = el.getAttribute('data-sheet-format') || null;
        const val = self.getCell(a1);
        setElem(el, val, fmt);
      });

      const nodesCR = document.querySelectorAll('[data-sheet-col][data-sheet-row]');
      nodesCR.forEach((el) => {
        const col = el.getAttribute('data-sheet-col').trim();
        const rowStr = el.getAttribute('data-sheet-row').trim();
        const row = parseInt(rowStr, 10);
        const fmt = el.getAttribute('data-sheet-format') || null;
        if (!col || isNaN(row)) return;
        const a1 = `${col}${row}`;
        const val = self.getCell(a1);
        setElem(el, val, fmt);
      });

      const nodesCI = document.querySelectorAll('[data-sheet-col][data-sheet-index]');
      nodesCI.forEach((el) => {
        const col = el.getAttribute('data-sheet-col').trim();
        const idxStr = el.getAttribute('data-sheet-index').trim();
        const idx = parseInt(idxStr, 10);
        const fmt = el.getAttribute('data-sheet-format') || null;
        if (!col || isNaN(idx)) return;
        const val = self.getFromColumnByIndex(col, idx);
        setElem(el, val, fmt);
      });
    }
  };

  global.SheetDispatcher = SheetDispatcher;

})(window);