export class BoardDisplay {
  static buildBoard({ boardSize, onShoot = null }, isEnemyBoard) {
    const container = document.createElement('div');
    container.classList.add('game-board');

    this.#appendChildren(boardSize, container);

    if (isEnemyBoard) {
      this.#attachShootEventHandler(onShoot, container);
    }

    return container;
  }

  static #appendChildren(size, container) {
    for (let y = 1; y <= size; y++) {
      for (let x = 1; x <= size; x++) {
        const cell = document.createElement('div');

        cell.dataset.x = x;
        cell.dataset.y = y;
        container.appendChild(cell);
      }
    }
  }

  static #attachShootEventHandler(onShoot, container) {
    container.addEventListener('click', (e) => {
      if (!e.target.dataset.x) return;

      const x = Number(e.target.dataset.x);
      const y = Number(e.target.dataset.y);
      const attack = onShoot([x, y]);

      if (attack.success) {
        const className = attack.hit ? 'hit' : 'missed';
        e.target.classList.add(className);
      }
    });
  }

  static showFleet(fleetPlacement, boardContainer) {
    fleetPlacement.forEach(({ size, dirVector, coordinates }) => {
      const [col, row] = coordinates[0];

      const [dx, dy] = dirVector;
      const rowSpan = dy ? size : 1;
      const colSpan = dx ? size : 1;

      const overlay = this.#overlayElement(row, rowSpan, col, colSpan);
      boardContainer.appendChild(overlay);
    });
  }

  static #overlayElement(rowStart, rowSpan, colStart, colSpan) {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    overlay.style.gridColumn = `${colStart} / span ${colSpan}`;
    overlay.style.gridRow = `${rowStart} / span ${rowSpan}`;
    return overlay;
  }
}
