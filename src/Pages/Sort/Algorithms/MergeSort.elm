module Pages.Sort.Algorithms.MergeSort exposing (mergeSortSteps)

import Algorithms.MergeSort as MergeSort


mergeSortSteps : List comparable -> ( List comparable, List (List comparable), List ( Int, Int ) )
mergeSortSteps =
    mergeSortStepsAux 0


mergeSortStepsAux : Int -> List comparable -> ( List comparable, List (List comparable), List ( Int, Int ) )
mergeSortStepsAux i l =
    case l of
        [] ->
            ( [], [], [] )

        a :: [] ->
            ( [ a ], [], [] )

        _ ->
            let
                ( left, right ) =
                    MergeSort.split l
            in
            case ( mergeSortStepsAux i left, mergeSortStepsAux (i + List.length left) right ) of
                ( ( sortedLeft, resLeft, sequenceLeft ), ( sortedRight, resRight, sequenceRight ) ) ->
                    let
                        ( sortedL, res, sequence ) =
                            mergeSteps sortedLeft sortedRight i (i + List.length left)
                    in
                    ( sortedL
                    , List.map (\ele -> ele ++ right) resLeft ++ List.map (\ele -> sortedLeft ++ ele) resRight ++ res
                    , sequenceLeft ++ sequenceRight ++ sequence
                    )


mergeSteps : List comparable -> List comparable -> Int -> Int -> ( List comparable, List (List comparable), List ( Int, Int ) )
mergeSteps l1 l2 i1 i2 =
    case ( l1, l2 ) of
        ( [], _ ) ->
            ( l2, [l2], [(i1, i2)] )

        ( _, [] ) ->
            ( l1, [l1], [(i1, i2)] )

        ( e1 :: r1, e2 :: r2 ) ->
            if e1 < e2 then
                let
                    ( l, res, seq ) =
                        mergeSteps r1 (e2 :: r2) (i1 + 1) i2
                in
                ( e1 :: l
                , (e1 :: r1 ++ e2 :: r2) :: List.map (\a -> e1 :: a) res
                , ( i1, i2 ) :: seq
                )

            else
                let
                    ( l, res, seq ) =
                        mergeSteps (e1 :: r1) r2 (i1 + 1) (i2 + 1)
                in
                ( e2 :: l
                , (e2 :: (e1 :: r1) ++ r2) :: List.map (\a -> e2 :: a) res
                , ( i1, i2 + 1 ) :: seq
                )
