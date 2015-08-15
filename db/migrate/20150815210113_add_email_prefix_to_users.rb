class AddEmailPrefixToUsers < ActiveRecord::Migration
  def change
    add_column :users, :email_prefix, :string, null: false
  end
end
