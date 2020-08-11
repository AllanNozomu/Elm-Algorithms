module Algorithms.KthLowestElement exposing (kthLowestElement)

import List
lessOrEqual : comparable -> List comparable -> List comparable
lessOrEqual i =
    List.foldr (\ele acc -> if ele <= i then ele :: acc else acc) []

greaterThan : comparable -> List comparable ->  List comparable
greaterThan i =
    List.foldr (\ele acc -> if ele > i then ele :: acc else acc) []

kthLowestElement : List comparable -> Int -> Maybe comparable
kthLowestElement l k = 
    case l of
        [] -> Nothing
        x :: r ->
            let
                left = lessOrEqual x r 
                right = greaterThan x r 
            in
            if k - 1 == List.length left  then
                Just x
            else if k - 1 < List.length left then
                kthLowestElement left k
            else
                k - (List.length left + 1) |>
                kthLowestElement right 