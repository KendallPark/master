class CardContent < ActiveRecord::Base
  belongs_to :user
  has_many :cards
  has_attached_file :front_image, styles: {
    thumb: '250x180>',
    medium: '600x430>'
  }
  has_attached_file :back_image, styles: {
    thumb: '250x180>',
    medium: '600x430>'
  }
  # Validate the attached image is image/jpg, image/png, etc
  validates_attachment_content_type :back_image, :content_type => /\Aimage\/.*\Z/
  validates_attachment_content_type :front_image, :content_type => /\Aimage\/.*\Z/

  def remixed?
    cards.where.not(id: user_id).any?
  end

end
