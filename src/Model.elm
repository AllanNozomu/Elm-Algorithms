module Model exposing (Model, initModel)

type alias Model =
    { seed : Int
    , listToBeSorted : List Int
    , orderedList : List Int
    , steps : List (List Int)
    , currentStep : List Int
    , leftRightSequence : List ( Int, Int )
    , currentLeft : Int
    , currentRight : Int
    , index : Int
    , pause : Bool
    }


initModel : Model
initModel =
    { seed = 0
    , listToBeSorted = []
    , steps = []
    , currentStep = []
    , orderedList = []
    , leftRightSequence = []
    , currentLeft = 0
    , currentRight = 0
    , index = 0
    , pause = True
    }