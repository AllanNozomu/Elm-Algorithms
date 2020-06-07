module Algorithms.SelectionSort exposing (selectionSort)


selectionSort : List comparable -> List comparable
selectionSort l =
    case l of
        [] ->
            []

        a :: r ->
            let
                ( minPosition, minValue ) =
                    getMinAndPosition l a
            in
            minValue :: (selectionSort <| insertList r (minPosition - 1) a)

getMinAndPosition : List comparable -> comparable -> ( Int, comparable )
getMinAndPosition l default =
    case l of
        [] ->
            ( 0, default )

        a :: _ ->
            List.indexedMap Tuple.pair l
            |> List.foldl
                (\acc curr ->
                    if Tuple.second acc <= Tuple.second curr then
                        acc
                    else
                        curr
                ) ( 0, a )

insertList : List a -> Int -> a -> List a
insertList l pos ele =
    List.indexedMap (\index v -> if index == pos then ele else v) l