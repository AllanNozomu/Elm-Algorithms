module Model exposing (Model, initModel, CurrentModel(..))

import Array exposing (Array)
import Browser.Navigation as Nav
import Algorithms.Visualization.Model
import Url

type CurrentModel = 
    SortAlgorithmsModel Algorithms.Visualization.Model.Model

type alias Model =
    { url : Url.Url
    , key : Nav.Key
    , currentModel : CurrentModel
    }

initModel : Url.Url -> Nav.Key -> Model
initModel url key =
    { key = key
    , url = url
    , currentModel = SortAlgorithmsModel Algorithms.Visualization.Model.initModel
    }
