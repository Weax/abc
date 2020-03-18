import React, { useState } from 'react';
import './App.scss';

/* 
  CSV parser using CSV specification:
  https://tools.ietf.org/html/rfc4180  
*/

function App() {
  const [table, setTable] = useState([]);
  const [header, setHeader] = useState([]);

  const _delimiter = ','; // RFC 4180 #2.4
  const _newline = '\n'; // CRLF \r\n (RFC 4180 #2.1) may not work on Windows, use only LF
  const _quoteChar = '"'; // RFC 4180 #2.5
  const _insideQuote = _quoteChar + _quoteChar; // RFC 4180 #2.7

  const splitter = (string, splitChar) => {
    let insideQuote = false,
      array = [],
      charStack = [];

    const chars = string.split('');
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const prevChar = chars[i - 1];
      const nextChar = chars[i + 1];

      if (char === _quoteChar && nextChar !== _quoteChar && prevChar !== _quoteChar) { // RFC 4180 #2.5, #2.6, #2.7
        insideQuote = !insideQuote;
      }
      if (char === splitChar && !insideQuote) {
        array.push(charStack.join(''));
        charStack = [];
      } else {
        charStack.push(char);
      }

    }

    array.push(charStack.join(''));
    return array;
  }

  const formatCols = (cols) => {
    return cols.map(col => {
      col = col.replace( new RegExp(`^\\s*${_quoteChar}|${_quoteChar}\\s*$`, 'g'), ''); // remove spaces from start and end if col is in quotes    
      col = col.replace( new RegExp(`^${_quoteChar}(.*)${_quoteChar}$`), '$1'); // remove " from start and end
      col = col.replace( new RegExp(_insideQuote, 'g'), _quoteChar); // replace "" by " RFC 4180 #2.7
      return col;
    });
  }

  const parseRow = (row) => {
    return splitter(row, _delimiter);
  }

  const splitToRows = (csv) => {
    return splitter(csv, _newline);
  }

  const parse = (csv) => {
    const rows = splitToRows(csv);
    return rows.filter(r => r.length).map(row => formatCols(parseRow(row)));
  }

  const resetOutput = () => {
    setHeader([]);
    setTable([]);
  }

  const setOutput = (table, withHeader) => {
    if (withHeader) {
      const header = table.shift(); //mutate table only for simplicity
      setHeader(header);
    }
    setTable(table);
  }

  const handleParseBtn = () => {
    resetOutput();

    const csv = document.getElementById('input').value;
    const withHeader = document.getElementById('header').checked;

    const table = parse(csv);
    setOutput(table, withHeader);
  }

  return (
    <div className="App">
      <p>Enter CSV contents below:</p>
      <p><label><input type="checkbox" id="header" />With header</label></p>
      <textarea id="input"></textarea>
      <br />
      <button onClick={handleParseBtn}>Parse</button>
      <hr />
      <p>Output:</p>
      {(table.length > 0 || header.length > 0) &&
        <table>
          <thead>
            <tr>
              {header.map((col, j) =>
                <th key={j}>{col}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) =>
              <tr key={i}>
                {row.map((col, j) =>
                  <td key={j}>{col}</td>
                )}
              </tr>
            )}
          </tbody>

        </table>
      }
    </div>
  );
}

export default App;
