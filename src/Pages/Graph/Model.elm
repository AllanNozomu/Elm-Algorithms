module Pages.Graph.Model exposing (Model, initModel)

import Algorithms.Graphs.MazeGenerator exposing (Dimension, Maze, Path, Position, generatePath, pathToMaze, pathToEdgesPerNode, dfs)
import Dict

type alias Model =
    { maze : Maze
    , path : Path
    , edgeLen : Float
    , beginEndPath : Path
    }


initModel : Model
initModel =
    let
        dimension =
            Dimension 62 62
        path = 
            generatePath dimension 272
        beginEndPath = dfs (Position 0 0) (Position 61 61) (pathToEdgesPerNode path)
    in
    { path = path
    , maze = path |> pathToMaze dimension
    , edgeLen = 512
    ,beginEndPath = beginEndPath
    }
