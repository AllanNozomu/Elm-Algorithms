module TransposeMatrix exposing (transpose)

import Array exposing (Array)


transpose : Array (Array a) -> Array (Array a)
transpose matrix =
    let
        firstValue =
            Array.get 0 matrix
                |> Maybe.withDefault Array.empty
                |> Array.get 0

        numColumns = Array.get 0 matrix
                |> Maybe.withDefault Array.empty
                |> Array.length

        columns =
                Array.initialize numColumns identity
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
                columns

        _ ->
            Array.fromList [ Array.empty ]
