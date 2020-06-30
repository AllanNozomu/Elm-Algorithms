module Pages.Graph.Model exposing (Model, initModel)

import Algorithms.Graphs.MazeGenerator exposing (Maze, Dimension, Path, generatePath, pathToMaze)


type alias Model =
    { maze : Maze,
    path : Path }

initModel : Model
initModel  =
    let
        dimension = Dimension 62 62
    in
    { 
        path = generatePath dimension 1,
        maze = generatePath dimension 1 |> pathToMaze dimension
    }