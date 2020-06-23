module Pages.Sort.Algorithms.MergeSort exposing (mergeSortSteps, strCode)

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

strCode : String
strCode =
    """module Algorithms.MergeSort exposing (mergeSort, split)

mergeSort : List comparable -> List comparable
mergeSort l = 
    case l of
        [] -> []
        a :: [] -> [ a ]
        _ ->  
            case split l |> Tuple.mapBoth mergeSort mergeSort of 
            (x,y) ->  merge x y

merge : List comparable -> List comparable -> List comparable
merge l1 l2 =
    case ( l1, l2 ) of
        ( [], _ ) -> l2
        ( _, [] ) -> l1
        ( e1 :: r1, e2 :: r2 ) ->
            if e1 < e2 then
                e1 :: merge r1 (e2 :: r2)
            else
                e2 :: merge (e1 :: r1) r2

split : List a -> (List a, List a)
split l =
    let
        splitAux : List a -> List a -> (List a, List a)
        splitAux x y = 
            case (x,y) of
                (xs::xr, _::_::yr) -> splitAux xr yr |> Tuple.mapFirst ((::) xs)
                (xs, _) -> ([], xs)
    in
    splitAux l l
-- """