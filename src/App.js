import React, { useState } from 'react';
import './App.scss';

function App() {
  const [table, setTable] = useState([]);
  const [header, setHeader] = useState([]);

  const _delimiter = ',';
  const _newline = '\n';
  const _quoteChar = '"';
  //const _insideQuote = _quoteChar + _quoteChar;


  const parseRow = (row) => {

    let insideQuote = false,
      entries = [],
      entry = [];

    row.split('').forEach(function (character) {
      if (character === _quoteChar) {
        insideQuote = !insideQuote;
      } else {
        if (character === _delimiter && !insideQuote) {
          entries.push(entry.join(''));
          entry = [];
        } else {
          entry.push(character);
        }
      }
    });
    entries.push(entry.join(''));
    return entries;
  }

  const parse = (csv) => {
    let rows = csv.split(_newline);
    return rows.filter(r => r.length).map(parseRow);
  }

  const handleParseBtn = () => {
    setHeader([]);
    setTable([]);

    const csv = document.getElementById('input').value;
    const withHeader = document.getElementById('header').checked;

    const table = parse(csv);

    if (withHeader) {
      const header = table.shift(); //we can mutate table here
      setHeader(header);
    }
    setTable(table);

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
