class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable
  validates :email, presence: true, email: true
  validate :mizzou_med_students_only


private
  def mizzou_med_students_only
    ! /@health.missouri.edu$/.match(email).nil?
  end
end
