class BasePresenter

  def self.present(item_or_collection, *args)
    return nil if item_or_collection.nil?

    presenter = self.new

    return presenter.present_all(item_or_collection, *args) if collection?(item_or_collection)
    presenter.present(item_or_collection, *args)
  end

  def self.collection?(item_or_collection)
    item_or_collection.respond_to?(:each)
  end


  def present(item, *args)
    raise NotImplementedError
  end

  def present_all(collection, *args)
    collection.map { |item| present(item, *args) }
  end

end
