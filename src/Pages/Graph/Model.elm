module Pages.Graph.Model exposing (Model, initModel)

import Algorithms.Graphs.MazeGenerator exposing (Maze, Dimension, generateMaze)


type alias Model =
    { maze : Maze}

initModel : Model
initModel  =
    { 
        maze = generateMaze (Dimension 20 20) 1
    }