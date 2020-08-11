module Algorithms.TransposeMatrix exposing (transpose)

import Array exposing (Array)


transpose : Array (Array a) -> Array (Array a)
transpose matrix =
    let
        firstValue =
            Array.get 0 matrix
                |> Maybe.withDefault Array.empty
                |> Array.get 0

        columnsLen = Array.get 0 matrix
                |> Maybe.withDefault Array.empty
                |> Array.length

        numColumns =
                Array.initialize columnsLen identity
    in
    case firstValue of
        Just def ->
            Array.indexedMap
                (\index _ ->
                    Array.map
                        (\r ->
                            Array.get index r |> Maybe.withDefault def
                        )
                        matrix
                )
            <|
                numColumns

        _ ->
            Array.fromList [ Array.empty ]
