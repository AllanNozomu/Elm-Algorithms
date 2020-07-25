module Pages.Graph.Model exposing (Model, initModel)

import Algorithms.Graphs.MazeGenerator exposing (Dimension, Maze, Path, Position, Edge, generatePath, pathToMaze, pathToEdgesPerNode, dfs)
import Array exposing (Array)
import Dict exposing (Dict)

type alias Model =
    { maze : Maze
    , path : Path
    , edgeLen : Float
    , beginEndPath : Path
    , allSteps : List (Edge)
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
    { path = path
    , maze = path |> pathToMaze dimension
    , edgeLen = 1024
    , beginEndPath = beginEndPath
    , allSteps = []
    -- , allSteps = Array.fromList allSteps
    , index = 1
    , drawed = Dict.empty
    }
