# STL Volume and Surface Area Calculator

This repository contains a web application that visualizes and calculates the volume and surface area of 3D models stored in STL files. The application uses Three.js for rendering and supports various shading options.

## Features

- Visualize STL files in 3D.
- Calculate the volume and surface area of STL files.
- Toggle display of axes.
- Switch between different shading options.

## Requirements

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/stl-volume-surface-calculator.git
    cd stl-volume-surface-calculator
    ```

2. Install the required packages:
    ```sh
    npm install
    ```

## Usage

1. Start the development server:
    ```sh
    npm start
    ```

2. Open your browser and navigate to `http://localhost:3000`.

3. Pass the STL file path as a query parameter in the URL:
    ```sh
    http://localhost:3000/?filePath=path/to/your/file.stl
    ```

Examples: 
[Moneda](http://localhost/index.html?filePath=STL/Moneda.stl)
[Skull](http://localhost/index.html?filePath=STL/Skull.stl)
[Base with key](http://localhost/index.html?filePath=STL/Base%20with%20key.stl)


## Controls

- **Show Axes**: Toggle the display of the axes helper.
- **Shading**: Switch between different shading options (wireframe, normal).

## Code Overview

- **Three.js**: Used for rendering the 3D scene.
- **STLLoader**: Loads STL files.
- **OrbitControls**: Allows orbiting around the 3D model.
- **GUI**: Provides a graphical user interface for toggling options.
- **Stats**: Displays performance statistics.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

If you have any questions or suggestions, feel free to open an issue or contact me at kandarp.gautam@gmail.com.

---

Happy visualizing and calculating!
