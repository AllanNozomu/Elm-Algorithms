module Algorithms.BubbleSort exposing (bubbleSort)

bubbleSort : List comparable -> List comparable
bubbleSort l =
    let
        bubbleSortWrapper i ll =
            let
                newList = bubbleSortAux (i - 1) ll
            in
            if newList == ll then
                newList
            else
                bubbleSortWrapper (i - 1) newList
    in
    bubbleSortWrapper (List.length l) l

bubbleSortAux : Int -> List comparable -> List comparable
bubbleSortAux i l =
    if i == 0 then
        l
    else case l of
        [] -> []
        a :: [] -> [a]
        a :: b :: r ->
            if a > b then
                b :: bubbleSortAux (i-1) (a :: r)
            else
                a :: bubbleSortAux (i-1) (b :: r)
