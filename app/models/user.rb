class User < ActiveRecord::Base
  has_many :cards
  has_many :card_contents
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable
  validates :email, presence: true, email: true
  validates :first_name, presence: true
  validates :last_name, presence: true
  validate :mizzou_med_students_only

  def full_name
    "#{first_name} #{last_name}"
  end

private
  def mizzou_med_students_only
    if /@health.missouri.edu$/.match(email).nil?
      errors[:email] << "Needs to be a @health.missouri.edu email"
    end
  end
end
