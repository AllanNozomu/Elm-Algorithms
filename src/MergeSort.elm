module MergeSort exposing (mergeSort)

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
