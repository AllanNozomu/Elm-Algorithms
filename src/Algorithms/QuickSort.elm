module Algorithms.QuickSort exposing (quickSort)

quickSort : List comparable -> List comparable
quickSort l = 
    case l of
        [] -> []
        [a] -> [a]
        a :: r ->  
            let
                left = List.filter ((>) a) r
                    |> quickSort 
                right = List.filter ((<=) a) r
                    |> quickSort 
            in
                left ++ a :: right