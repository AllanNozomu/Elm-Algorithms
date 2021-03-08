<!-- Template by https://github.com/othneildrew/Best-README-Template -->
[![MIT License][license-shield]][license-url]
[![Built with Elm][built-with-shield]](https://elm-lang.org/)

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center">Elm Algorithms</h3>

  <p align="center">
    Algorithms and some visualizations using Elm
    <br />
    <a href="https://allannozomu.github.io/Elm-Algorithms/">View Demo</a>
    ·
    <a href="https://github.com/AllanNozomu/Elm-Algorithms">Report Bug</a>
    ·
    <a href="https://github.com/AllanNozomu/Elm-Algorithms">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Sort</a></li>
        <li><a href="#built-with">Graph</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This project contains some algorithms written in Elm and also visualization of some of these algorithms. It includes:

* Sorts
    * Bubble Sort*
    * Merge Sort*
    * Quick Sort*
    * Selection Sort*
* Kth lowest element
* Transpose Matrix
* Graphs
    * DFS*
    * Kruskal maze generator*

\* _algorithms containing visualization_

The website was developed also in Elm. The source code is also here, at the same repository.

### Sort

![Merge Sort][sort-gif]

There are some features in the Sort Algorithms visualization like:

* :gear: Select how many elements are going to be sorted
* :bar_chart: Step-by-step iteration
* :1234: Count of how many steps (approximation)
* :crayon: Color usage to indicate interesting pivots, comparations
* :play_or_pause_button: Pause/Continue
* :game_die: Shuffle to generate other random set to be ordered
* :computer: Code included
* :sound: Sounds

In order to generate the steps, a not so easy to understand code was done to save all the iterations that happened in the set (including comparations and swaps). All the steps are saved in a big list to enable the step-by-step feature. This consume a lot of memory of the browser.

### Graph

At the DFS, you can select the start and end points. The starting point will be the blue and the end point will be the green one. 
There are some colors in the path. The blue one is a possible candidate to be the final path, the red lines are paths that will not be included in the final path since they have already been tested and backtracked. The green one are the final path. 

![dfs][dfs-gif]

At the maze generation, there are current no features. Some features that it could include are: change the size of the maze, generate using other algorithms.

![Kruskal Maze Generator][maze-gif]

### Built With

* [Elm](https://elm-lang.org/)

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Project Link: [https://github.com/allannozomu/Elm-Algorithms](https://github.com/AllanNozomu/Elm-Algorithms/)

[license-shield]: https://img.shields.io/github/license/allannozomu/Elm-Algorithms.svg?style=for-the-badge 
[license-url]: https://github.com/AllanNozomu/Elm-Algorithms/blob/master/LICENSE
[built-with-shield]: https://img.shields.io/badge/Built%20with-Elm-5FABDC?style=for-the-badge
[sort-gif]: images/mergesort.gif
[dfs-gif]: images/dfs.gif
[maze-gif]: images/maze.gif