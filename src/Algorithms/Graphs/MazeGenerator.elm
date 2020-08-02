module Algorithms.Graphs.MazeGenerator exposing (..)

import Array exposing (Array)
import Dict exposing (Dict)
import Random
import Random.List

type Tile
    = Occupied
    | Free


type alias Maze =
    Array (Array Tile)


type alias Dimension =
    { width : Int
    , height : Int
    }


type alias Position =
    { y : Int
    , x : Int
    }


type alias Edge =
    { from : Position
    , to : Position
    }


type alias Path =
    List Edge

pathToEdgesPerNode : Path -> Dict (Int, Int) (List Position)
pathToEdgesPerNode path = 
    let
        completePath = path ++ List.map (\{from, to} -> {from = to, to = from}) path
    in
        List.foldr (\{from, to} acc -> 
            let
                edges = to :: (Maybe.withDefault [] <| Dict.get (from.y, from.x) acc)
            in
            (
                Dict.insert (from.y, from.x) edges acc
            )
        ) Dict.empty completePath

listPositionToPath : (List Position) -> Path
listPositionToPath l =
    List.foldl (\curr (prev, acc) ->
        case prev of
            Nothing -> (Just curr, acc)
            Just p -> (Just curr, Edge p curr :: acc)
        ) 
    (Maybe.Nothing, []) l
    |> Tuple.second

dfs : Position -> Position -> Dict (Int, Int) (List Position) -> (Path, Path)
dfs f t e =
    let
        dfsAux from to visited =
            let
                getNotVisited : List Position
                getNotVisited =
                    Maybe.withDefault [] (Dict.get (from.y, from.x) e) 
                        |> List.filter (\neigh -> not <| Maybe.withDefault False (Dict.get (neigh.y, neigh.x) visited))
            in

            if from == to then
                ([to],[to])
            else if Maybe.withDefault False (Dict.get (from.y, from.x) visited) then
                ([],[from])
            else 
                let
                    new_visited = Dict.insert (from.y, from.x) True visited
                    (results, allpaths) = getNotVisited
                        |> List.foldl (\neighbour (accRes, accPaths) -> 
                            let 
                                (res, paths) = dfsAux neighbour to new_visited
                            in
                            if List.isEmpty accRes then
                                if List.isEmpty res then
                                    ([], (paths ++ [from]) :: accPaths)
                                else 
                                    (res, (paths ++ [from]) :: accPaths)
                            else
                                (accRes, accPaths)
                        ) ([],[])
                        |> Tuple.mapSecond 
                            List.concat
                in
                case results of
                    [] -> ([], from :: allpaths)
                    a -> (from :: a, from :: allpaths)
    in
    dfsAux f t Dict.empty 
    |> Tuple.mapBoth listPositionToPath listPositionToPath
    

generatePairs : Dimension -> List Edge
generatePairs { width, height } =
    let
        getNeigh i j =
            case ( i, j ) of
                ( 0, 0 ) ->
                    []

                ( 0, x ) ->
                    [ Edge (Position 0 (x - 1)) (Position 0 x) ]

                ( y, 0 ) ->
                    [ Edge (Position (y - 1) 0) (Position y 0) ]

                ( y, x ) ->
                    [ Edge (Position (y - 1) x) (Position y x), Edge (Position y (x - 1)) (Position y x) ]
    in
    List.range 0 (height - 1)
        |> List.map
            (\i ->
                List.range 0 (width - 1)
                    |> List.map
                        (\j ->
                            getNeigh i j
                        )
                    |> List.concat
            )
        |> List.concat

generatePath : Dimension -> Int -> Path
generatePath dimension seedNumber =
    let
        { width, height } =
            dimension
        initialSeed = Random.initialSeed seedNumber
    in
    case ( width, height ) of
        ( 0, _ ) ->
            []

        ( _, 0 ) ->
            []
            

        _ ->
            Random.step (Random.List.shuffle (generatePairs dimension)) initialSeed
            |> Tuple.first
            |> getPathFromPairs dimension

mazeToString : Maze -> String
mazeToString maze =
    let
        getLine line =
            Array.foldr
                (\tile acc ->
                    (case tile of
                        Occupied ->
                            '#'

                        Free ->
                            ' '
                    )
                        :: acc
                )
                []
                line
                |> String.fromList
    in
    Array.foldl (\line acc -> acc ++ [ getLine line ]) [] maze |> String.join "\n"


pathToMaze : Dimension -> Path -> Maze
pathToMaze dimension path =
    let
        { width, height } =
            dimension

        initMaze =
            Array.initialize (2 * height + 1)
                (\i ->
                    Array.initialize (2 * width + 1)
                        (\j ->
                            case ( i, j ) of
                                ( 0, _ ) ->
                                    Occupied

                                ( _, 0 ) ->
                                    Occupied

                                ( y, x ) ->
                                    if Basics.remainderBy 2 y == 1 && Basics.remainderBy 2 x == 1 then
                                        Free

                                    else
                                        Occupied
                        )
                )

        getPos { from, to } =
            let
                horizontal =
                    from.x == to.x
            in
            if horizontal then
                Position  (Basics.max from.y to.y * 2) (2 * from.x + 1)

            else
                Position (2 * from.y + 1) (Basics.max from.x to.x * 2)

        setOccupied maze edge =
            let
                pos =
                    getPos edge
                line = Maybe.withDefault Array.empty (Array.get pos.y maze)
            in
            Array.set pos.y (Array.set pos.x Free line) maze
    in
    List.foldl (\edge acc -> setOccupied acc edge) initMaze path


getPathFromPairs : Dimension -> List Edge -> Path
getPathFromPairs dimension allEdges =
    let
        { width, height } =
            dimension
    in
    getPathFromPairsAux dimension allEdges (Array.initialize (width * height) identity) []

getPivotAndCompress : Int -> Array Int -> (Int, Array Int)
getPivotAndCompress index arr =
    let
        current =
            Array.get index arr |> Maybe.withDefault 0
    in
    if index == current then
        (index, arr)
    else
        let
            (res, newArr) = getPivotAndCompress current arr
        in
        (res, Array.set index res newArr)

getPathFromPairsAux : Dimension -> List Edge -> Array Int -> Path -> Path
getPathFromPairsAux dimension edges pivots acc =
    case edges of
        [] ->
            acc

        { from, to } :: r ->
            let
                fromIndex = from.y * dimension.width + from.x
                toIndex = to.y * dimension.width + to.x
                (pivotFrom, pivotsFrom) =
                    getPivotAndCompress fromIndex pivots
                (pivotTo, pivotsTo) =
                    getPivotAndCompress toIndex pivotsFrom

                newEdge =
                    Edge from to
            in
            if pivotTo == pivotFrom then
                getPathFromPairsAux dimension r pivots acc
            else
                getPathFromPairsAux dimension r (Array.set pivotFrom pivotTo pivotsTo) (newEdge :: acc)
