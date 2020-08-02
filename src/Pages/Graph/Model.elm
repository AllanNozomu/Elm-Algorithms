module Pages.Graph.Model exposing (Model, initModel)

import Algorithms.Graphs.MazeGenerator exposing (Dimension, Maze, Path, Position, Edge, generatePath, pathToMaze, pathToEdgesPerNode, dfs)
import Set exposing (Set)
import Dict exposing (Dict)
import Array exposing (Array)
import Debug

type alias Model =
    { edgeLen : Float
    , maze : Path
    , beginEndPath : Path
    , drawedSteps : Path
    , index : Int
    , drawed : Dict ((Int, Int), (Int, Int)) Int
    , title : String
    , allSteps : Path
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
    { maze = path
    , title = "DFS"
    , edgeLen = 1024
    , beginEndPath = beginEndPath
    , drawedSteps = []
    , index = 1
    , drawed = Dict.empty
    , allSteps = allSteps
    }
