module Pages.Sort.Algorithms.SelectionSort exposing (selectionSortSteps)

selectionSortSteps : List comparable -> (List comparable, List (List comparable), List (Int, Int))
selectionSortSteps l =
    let 
        (sortedList, allSteps) = selectionSortStepsAux l 0 [] []
            |> Tuple.mapSecond List.reverse
    
        leftRightSequence =
                    List.map (\( _, lr ) -> lr) allSteps
                        |> List.concat
        steps = List.map (\( st, lr ) -> List.repeat (List.length lr) st) allSteps
                        |> List.concat
    in
        (sortedList, steps, leftRightSequence)

selectionSortStepsAux : List comparable -> Int -> List comparable -> List ( List comparable, List ( Int, Int ) ) -> ( List comparable, List ( List comparable, List ( Int, Int ) ) )
selectionSortStepsAux l index orderedList steps =
    case l of
        [] ->
            ( orderedList, steps )

        a :: r ->
            let
                ( minPosition, minValue, minSteps ) =
                    getMinAndPositionSteps l 0 ( 0, a ) []

                changedSubList = insertList r (minPosition - 1) a

                addI = (+) index

                newMinSteps = minSteps |> List.reverse |> List.map(\p -> Tuple.mapBoth addI addI p) 
                newSteps = ( orderedList ++ l, newMinSteps ) :: steps
            in
            selectionSortStepsAux changedSubList (index + 1) (orderedList ++ [minValue]) newSteps


getMinAndPositionSteps : List comparable -> Int -> ( Int, comparable ) -> List ( Int, Int ) -> ( Int, comparable, List ( Int, Int ) )
getMinAndPositionSteps l index ( minPosition, minValue ) steps  =
    case l of
        [] ->
            ( minPosition, minValue, steps )

        v :: r ->
            let
                ( newPosition, newMin ) =
                    if v < minValue then
                        ( index, v )

                    else
                        ( minPosition, minValue )

                newSteps =
                    ( index, newPosition ) :: steps
            in
            getMinAndPositionSteps r (index + 1) ( newPosition, newMin ) newSteps

insertList : List a -> Int -> a -> List a
insertList l pos ele =
    List.indexedMap (\index v -> if index == pos then ele else v) l