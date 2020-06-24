module Pages.Sort.Algorithms.BubbleSort exposing (bubbleSortSteps)


bubbleSortSteps : List comparable -> ( List comparable, List (List comparable), List ( Int, Int ) )
bubbleSortSteps l =
    bubbleSort (List.length l) l ( [], [] )


bubbleSort : Int -> List comparable -> ( List (List comparable), List ( Int, Int ) ) -> ( List comparable, List (List comparable), List ( Int, Int ) )
bubbleSort i l ( steps, leftRight ) =
    let
        ( newlist, st, lr ) =
            bubbleSortAuxSteps 0 (i - 1) [] l
    in
    if newlist == l then
        ( l, steps, leftRight )

    else
        bubbleSort (i - 1)
            newlist
            ( steps ++ st
            , leftRight ++ lr
            )


bubbleSortAuxSteps : Int -> Int -> List comparable -> List comparable -> ( List comparable, List (List comparable), List ( Int, Int ) )
bubbleSortAuxSteps i j ord l =
    if j == 0 then
        (l, [ord ++ l], [(i,i)] )
    else case l of
        [] ->
            ( [], [], [ ( i, i ) ] )

        a :: [] ->
            ( [ a ], [ ord ++ [ a ] ], [ ( i, i + 1 ) ] )

        a :: b :: r ->
            let
                smaller =
                    Basics.min a b

                bigger =
                    Basics.max a b

                ( ordered, steps, lr ) =
                    bubbleSortAuxSteps (i + 1) (j - 1) (ord ++ [ smaller ]) (bigger :: r)
            in
            ( smaller :: ordered, (ord ++ l) :: steps, ( i, i + 1 ) :: lr )