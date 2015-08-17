class CardContent < ActiveRecord::Base
  belongs_to :user
  has_many :cards
  has_attached_file :front_image, styles: {
    thumb: '100x100>',
    square: '200x200#',
    medium: '300x300>'
  }
  has_attached_file :back_image, styles: {
    thumb: '100x100>',
    square: '200x200#',
    medium: '300x300>'
  }
  # Validate the attached image is image/jpg, image/png, etc
  validates_attachment_content_type :back_image, :content_type => /\Aimage\/.*\Z/
  validates_attachment_content_type :front_image, :content_type => /\Aimage\/.*\Z/


end
