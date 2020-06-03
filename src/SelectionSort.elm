module SelectionSort exposing (selectionSort, selectionSortSteps)


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
            minValue
                :: (selectionSort <|
                        List.indexedMap
                            (\index v ->
                                if index + 1 == minPosition then
                                    a

                                else
                                    v
                            )
                            r
                   )


getMinAndPosition : List comparable -> comparable -> ( Int, comparable )
getMinAndPosition l default =
    case l of
        [] ->
            ( 0, default )

        a :: _ ->
            List.foldl
                (\( minpos, minv ) ( index, value ) ->
                    if minv <= value then
                        ( minpos, minv )

                    else
                        ( index, value )
                )
                ( 0, a )
            <|
                List.indexedMap Tuple.pair l


selectionSortSteps : List comparable -> ( List comparable, List ( List comparable, List ( Int, Int ) ) )
selectionSortSteps l =
    case l of
        [] ->
            ( [], [] )

        a :: r ->
            let
                ( minPosition, minValue, steps ) =
                    getMinAndPositionSteps l ( 0, a ) [] 0

                changedSubList =
                    List.indexedMap
                        (\index value ->
                            if index + 1 == minPosition then
                                a

                            else
                                value
                        )
                        r

                ( sortedList, recSteps ) =
                    selectionSortSteps <| changedSubList
            in
            ( minValue :: sortedList, List.map (\( rsl, rst ) -> ( minValue :: rsl, rst )) recSteps ++ [ ( minValue :: changedSubList, steps ) ] )


getMinAndPositionSteps : List comparable -> ( Int, comparable ) -> List ( Int, Int ) -> Int -> ( Int, comparable, List ( Int, Int ) )
getMinAndPositionSteps l ( minPosition, minValue ) steps index =
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
                    steps ++ [ ( index, newPosition ) ]
            in
            getMinAndPositionSteps r ( newPosition, newMin ) newSteps (index + 1)
