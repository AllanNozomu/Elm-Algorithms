module Pages.Graph.Model exposing (Model, initModel)

import Algorithms.Graphs.MazeGenerator exposing (Dimension, Maze, Path, Position, Edge, generatePath, pathToMaze, pathToEdgesPerNode, dfs)
import Dict exposing (Dict)

type alias Model =
    { maze : Maze
    , edgeLen : Float
    , toDrawPath : Path
    , beginEndPath : Path
    , drawedSteps : Path
    , index : Int
    , drawed : Dict (Position, Position) Int
    }


initModel : Model
initModel =
    let
        dimension =
            Dimension 30 30
        path = 
            generatePath dimension 272

        (beginEndPath, allSteps) = dfs (Position 0 0) (Position 29 29) (pathToEdgesPerNode path)
    in
    { toDrawPath = path
    , maze = path |> pathToMaze dimension
    , edgeLen = 1024
    , beginEndPath = beginEndPath
    , drawedSteps = []
    , index = 1
    , drawed = Dict.empty
    }
