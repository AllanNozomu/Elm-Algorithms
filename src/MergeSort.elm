module MergeSort exposing (mergeSort)

mergeSort : List comparable -> List comparable
mergeSort l = 
    split l

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

split : List comparable -> List comparable
split l =
    case l of
        [] -> []
        a :: [] -> [ a ]
        _ ->
            let
                left = 
                    List.take (List.length l // 2) l |> split
                right =
                    List.drop (List.length l // 2) l |> split
            in
            merge left right