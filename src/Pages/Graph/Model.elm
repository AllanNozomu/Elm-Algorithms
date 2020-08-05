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
    , startPosition : Position
    , endPosition : Position
    , dimension : Dimension
    , selectBegin : Bool
    }


initModel : Model
initModel =
    let
        dimension =
            Dimension 14 14
        path = 
            generatePath dimension 272

        startPosition = 
            Position 0 0

        endPosition = 
            Position (dimension.height-1) (dimension.width-1)

        (beginEndPath, allSteps) = dfs startPosition endPosition (pathToEdgesPerNode path)
    in
    { maze = path
    , title = "DFS"
    , edgeLen = 1024
    , beginEndPath = beginEndPath
    , drawedSteps = []
    , index = 1
    , drawed = Dict.empty
    , allSteps = allSteps
    , startPosition = startPosition
    , endPosition = endPosition
    , dimension = dimension
    , selectBegin = True
    }
