module Pages.Sort.Algorithms.MergeSort exposing (mergeSortSteps)
import Algorithms.MergeSort as MergeSort

mergeSortSteps: List comparable -> (List comparable, List (List comparable), List (Int, Int))
mergeSortSteps l =
    mergeSortStepsAux l 0

mergeSortStepsAux : List comparable -> Int -> (List comparable, List (List comparable), List (Int, Int))
mergeSortStepsAux l i = 
    case l of
        [] -> ([], [], [])
        a :: [] -> ([ a ], [], [])
        _ ->  
            let
                (left, right) = MergeSort.split l
            in
            case (mergeSortStepsAux left i , mergeSortStepsAux right (i + List.length left)) of 
            ((sortedLeft, resLeft, sequenceLeft), (sortedRight, resRight, sequenceRight)) ->
                let
                    (sortedL, res, sequence) = mergeSteps sortedLeft sortedRight i (i + List.length left + 1)
                in  
                    (sortedL, 
                    List.map (\ele -> ele ++ right) resLeft ++ List.map (\ele -> sortedLeft ++ ele) resRight ++ res,
                    sequenceLeft ++ sequenceRight ++ sequence
                    )

mergeSteps : List comparable -> List comparable -> Int -> Int -> (List comparable, List (List comparable), List (Int, Int))
mergeSteps l1 l2 i1 i2=
    case ( l1, l2 ) of
        ( [], _ ) -> (l2, [], [])
        ( _, [] ) -> (l1, [], [])
        ( e1 :: r1, e2 :: r2 ) ->
            if e1 < e2 then
                let
                    (l, res, seq) = mergeSteps r1 (e2 :: r2) (i1+1) i2
                in 
                (e1 :: l,
                 (e1 :: r1 ++ e2 :: r2) :: List.map (\a -> e1 :: a) res,
                 (i1, i2) :: seq
                 )
            else
                let
                    (l, res, seq) = mergeSteps (e1 :: r1) r2 (i1+1) (i2+1)
                in 
                (e2 :: l,
                 (e2 :: (e1 :: r1) ++ r2) :: List.map (\a -> e2 :: a) res ,
                 (i1, i2) :: seq
                )