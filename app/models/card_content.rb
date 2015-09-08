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
    cards.where.not(user_id: user_id).any?
  end

  def remixed_by?(this_user)
    cards.where(user_id: this_user.id).any?
  end

end
