module Model exposing (Model, initModel, CurrentModel(..))

import Browser.Navigation as Nav
import Pages.Sort.Model
import Url

type CurrentModel = 
    SortAlgorithmsModel Pages.Sort.Model.Model
    | HomeModel 

type alias Model =
    { url : Url.Url
    , key : Nav.Key
    , currentModel : CurrentModel
    }

initModel : Url.Url -> Nav.Key -> Model
initModel url key =
    { key = key
    , url = url
    , currentModel = HomeModel
    }
