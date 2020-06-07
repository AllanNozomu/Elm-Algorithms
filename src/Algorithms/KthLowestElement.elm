module Algorithms.KthLowestElement exposing (kthLowestElement)

import List
lessOrEqual : List comparable -> comparable -> List comparable
lessOrEqual l i =
    List.foldr (\ele acc -> if ele <= i then ele :: acc else acc) [] l

greaterThan : List comparable -> comparable -> List comparable
greaterThan l i =
    List.foldr (\ele acc -> if ele > i then ele :: acc else acc) [] l

kthLowestElement : List comparable -> Int -> Maybe comparable
kthLowestElement l k = 
    case l of
        [] -> Nothing
        x :: r ->
            let
                left = lessOrEqual r x
                right = greaterThan r x
            in
            if k - 1 == List.length left  then
                Just x
            else if k - 1 < List.length left then
                kthLowestElement left k
            else
                k - (List.length left + 1) |>
                kthLowestElement right 