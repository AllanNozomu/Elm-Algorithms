module Algorithms.Graphs.MazeGenerator exposing (..)

import Array exposing (Array)
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

generateMaze : Dimension -> Int -> Maze
generateMaze dimension seedNumber =
    let
        { width, height } =
            dimension
        initialSeed = Random.initialSeed seedNumber
    in
    case ( width, height ) of
        ( 0, _ ) ->
            Array.empty

        ( _, 0 ) ->
            Array.empty
            

        _ ->
            Random.step (Random.List.shuffle (generatePairs dimension)) initialSeed
            |> Tuple.first
            |> getPath dimension
            |> pathToMaze dimension

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


getPath : Dimension -> List Edge -> Path
getPath dimension allEdges =
    let
        { width, height } =
            dimension
    in
    getPathAux dimension allEdges (Array.initialize (width * height) identity) []


getPathAux : Dimension -> List Edge -> Array Int -> Path -> Path
getPathAux dimension edges pivots acc =
    let
        getPivot pos =
            Array.get (pos.y * dimension.height + pos.x) pivots |> Maybe.withDefault 0

        samePivot a b =
            getPivot a == getPivot b
    in
    case edges of
        [] ->
            acc

        { from, to } :: r ->
            if samePivot from to then
                getPathAux dimension r pivots acc

            else
                let
                    newPivots =
                        Array.map
                            (\p ->
                                if p == getPivot from then
                                    getPivot to

                                else
                                    p
                            )
                            pivots

                    newEdge =
                        Edge from to
                in
                getPathAux dimension r newPivots (newEdge :: acc)
