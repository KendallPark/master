class Api::V1::TagsController < Api::V1::BaseController
  def index
    @tags = current_user.tags
    render json: TagPresenter.present(@tags)
  end
end
