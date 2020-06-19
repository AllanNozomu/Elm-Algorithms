module Pages.Sort.Algorithms.QuickSort exposing (quickSortSteps)

import Array exposing (Array)
import Random

swap : Int -> Int -> Array comparable -> Array comparable
swap i j a =
    case (Array.get i a, Array.get j a) of
        (Just ii, Just jj) -> Array.set i jj a
                |> Array.set j ii
        _ -> a

splitSteps : comparable -> List comparable -> (List comparable, List(List comparable), List (Int, Int))
splitSteps pivot l =
    let
        arr = Array.fromList l
        listLen = 
            List.length l
        lastPos =
            (-) (listLen - 2)
        leq i a =
            (Array.get i a |>
            Maybe.withDefault pivot) <= pivot

        ((resA, resSteps, resLeftRight), resI) = listLen - 2 |>
                    List.range 0 |>
                    List.foldl (\i ((acc, steps, lr), j) ->
                        if leq (i - j) acc then
                            ((acc, steps ++ [acc], lr ++ [(i - j, lastPos j)]), j)
                        else
                            ((swap (i - j) (lastPos j) acc, steps ++ [swap (i - j) (lastPos j) acc ], lr ++ [(i - j, lastPos j)] ), j+1)
                    ) ((arr, [arr], [(0, lastPos 0)]), 0)
        lastStep = 
            swap (listLen - resI - 1) (listLen - 1) resA 
        
    in
        (Array.toList lastStep,
        resSteps ++ [lastStep] |> List.map Array.toList,
        resLeftRight ++ [(listLen - resI - 1, listLen - resI - 1)])

movePivotFinal : List comparable -> (comparable, List comparable) -> (comparable, List comparable)
movePivotFinal l default =
    let
        (i, _) = Random.step (Random.int 0 (List.length l - 1)) (Random.initialSeed 0)
    in
    case List.drop i l of
        a::_ -> (a, Array.fromList l |> swap i (List.length l - 1) |> Array.toList)
        _ -> default

quickSortSteps : List comparable ->  (List comparable, List(List comparable), List (Int, Int))
quickSortSteps =
    quickSort

quickSort : List comparable ->  (List comparable, List(List comparable), List (Int, Int))
quickSort  l  = 
    case l of
        [] -> ([], [], [])
        [a] -> ([a], [], [])
        a :: r ->
            let
                (pivot, newL) = movePivotFinal l (a, r++[a])

                (semiOrdered, steps, leftRight) = splitSteps pivot newL
                pivotIndex = (List.filter (\x -> x <= pivot) newL |> List.length) - 1
                (left, leftSteps, leftLr) = List.take pivotIndex semiOrdered |> quickSort
                semiOrderedRight = List.drop (pivotIndex + 1) semiOrdered
                (right, rightSteps, rightLr) = List.drop (pivotIndex + 1) semiOrdered |> quickSort
            in
                (left ++ pivot :: right, 
                steps ++ List.map (\x -> x ++ pivot :: semiOrderedRight) leftSteps ++ List.map (\x -> left ++ pivot :: x) rightSteps,
                leftRight ++ leftLr ++ List.map (\p -> Tuple.mapBoth ((+) pivotIndex) ((+) pivotIndex) p) rightLr )