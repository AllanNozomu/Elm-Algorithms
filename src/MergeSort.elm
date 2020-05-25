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

halfsplit : List a -> (List a, List a)
halfsplit l =
    let
        halsplitAux : List a -> List a -> (List a, List a)
        halsplitAux x y = 
            case (x,y) of
                (xs::xr, _::_::yr) -> halsplitAux xr yr |> Tuple.mapFirst ((::) xs)
                (xs, _) -> ([], xs)
    in
    halsplitAux l l

split : List comparable -> List comparable
split l =
    case l of
        [] -> []
        a :: [] -> [ a ]
        _ ->  
            case halfsplit l |> Tuple.mapBoth split split of 
            (x,y) ->  merge x y

