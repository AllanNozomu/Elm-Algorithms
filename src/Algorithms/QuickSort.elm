module Algorithms.QuickSort exposing (quickSort)

lessOrEqual : comparable -> List comparable -> List comparable
lessOrEqual i =
    List.foldr (\ele acc -> if ele <= i then ele :: acc else acc) []

greaterThan : comparable -> List comparable ->  List comparable
greaterThan i =
    List.foldr (\ele acc -> if ele > i then ele :: acc else acc) []

quickSort : List comparable -> List comparable
quickSort l = 
    case l of
        [] -> []
        [a] -> [a]
        a :: r ->  
            let
                left = lessOrEqual a r
                    |> quickSort 
                right = greaterThan a r
                    |> quickSort 
            in
                left ++ a :: right