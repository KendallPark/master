require 'test_helper'

class Api::V1::CardsControllerTest < ControllerTestCase
  setup do
    @front_image_path = Rails.root.join('test', 'files', 'balloonsnake.jpg')
    @back_image_path = Rails.root.join('test', 'files', 'superheroes.jpg')
  end
  should "get an index" do
    get :index
    assert_equal CardPresenter.present(@user.cards).to_json, response.body
  end

  context "when deleting a card" do
    should "return a successful status" do
      card = cards(:only_one_card)
      delete :destroy, id: card.id
      assert_equal response.status, 200
    end
  end

  context "when getting a blank card" do
    should "return a blank card" do
      get :blank
      assert_equal Card.last.id, JSON.parse(response.body)["id"]
      assert_nil JSON.parse(response.body)["front"]
      assert_nil JSON.parse(response.body)["back"]
    end
  end

  context "when creating a card" do
    setup do
      @card_params = {
        front: "hello",
        back: "world",
        tag_list: ["hello", "world"]
      }
    end

    should "create a card" do
      assert_difference "Card.count", 1 do
        post :create, { card: @card_params }
      end
    end

    should "return the card as json" do
      post :create, { card: @card_params }
      assert_equal CardPresenter.present(Card.last).to_json, response.body
    end

    should "also create a card content" do
      assert_difference "CardContent.count", 1 do
        post :create, { card: @card_params }
      end
    end

    should "also create a card content with front and back" do
      post :create, { card: @card_params }
      card = Card.last
      assert_equal @card_params[:front], card.front
      assert_equal @card_params[:back], card.back
    end

    should "also save tags if any" do
      post :create, { card: @card_params }
      assert_equal @card_params[:tag_list], Card.last.tag_list
    end

    context "with a photograph" do
      setup do
        @front_file = Rack::Test::UploadedFile.new(@front_image_path, "image/jpeg")
        @back_file = Rack::Test::UploadedFile.new(@back_image_path, "image/jpeg")
      end

      should "upload the front image" do
        post :create, card: @card_params.merge(front_image: @front_file)
        assert Card.last.content.front_image.url
      end

      should "upload the back image" do
        post :create, card: @card_params.merge(back_image: @back_file)
        assert Card.last.content.back_image.url
      end
    end

    context "with someone else's content" do
      setup do
        @content = card_contents(:brett_howdy)
        @remixed_params = @card_params.merge(content_id: @content[:id])
      end

      should "create a card that references someone else's content" do
        post :create, { card: @remixed_params }
        card = Card.last
        assert_equal @content[:front], card.front
        assert_equal @content[:back], card.back
      end

      should "not have ownership of the content" do
        post :create, { card: @remixed_params }
        card = Card.last
        assert_not_equal card.user, card.content.user
      end
    end
  end

  context "when updating a card" do
    setup do
      @card = cards(:one)
      @card_params = {
        front: "good",
        back: "bye",
        tag_list: ["hello", "good"]
      }
    end

    should "delete front and back image" do
      @card.content.front_image = File.new(@front_image_path)
      @card.content.back_image = File.new(@back_image_path)
      @card.save!
      assert @card.content.front_image_file_name
      assert @card.content.back_image_file_name
      patch :update, { id: @card.id, card: { delete_front_image: true, delete_back_image: true }}
      @card.reload
      assert_nil @card.content.front_image_file_name
      assert_nil @card.content.back_image_file_name
    end

    should "update front and back" do
      patch :update, { id: @card.id, card: @card_params }
      @card.reload
      assert_equal @card_params[:front], @card.front
      assert_equal @card_params[:back], @card.back
    end

    should "update tags" do
      patch :update, { id: @card.id, card: @card_params }
      @card.reload
      assert_equal @card_params[:tag_list], @card.tag_list
    end

    should "clear tags if passed an empty array" do
      card_params = {
        front: "good",
        back: "bye",
        tag_list: []
      }
      patch :update, { id: @card.id, card: card_params }
      @card.reload
      assert_equal [], @card.tag_list
    end

    should "not change tags if tag_list entry is not there" do
      card_params = {
        front: "good",
        back: "bye"
      }
      original_tags = @card.tag_list
      patch :update, { id: @card.id, card: card_params }
      @card.reload
      assert_equal original_tags, @card.tag_list
    end

    should "update a photo" do
      @front_file = Rack::Test::UploadedFile.new(@front_image_path, "image/jpeg")
      @back_file = Rack::Test::UploadedFile.new(@back_image_path, "image/jpeg")
      card_params = {
        front_image: @front_file,
        back_image: @back_file
      }
      patch :update, { id: @card.id, card: card_params }
      assert Card.last.content.back_image.url
      assert Card.last.content.front_image.url
    end

    context "with someone else's content" do
      setup do
        @remix = cards(:kendall_remix)
        @remix_params = {
          front: "mine",
          back: "now"
        }
      end

      should "create new card content" do
        assert_difference "CardContent.count", 1 do
          patch :update, { id: @remix.id, card: @remix_params }
        end
      end

      should "create a new card content with the correct user id" do
        assert_not_equal @remix.user, @remix.content.user
        patch :update, { id: @remix.id, card: @remix_params }
        @remix.reload
        assert_equal @remix.user, @remix.content.user
      end

      should "create a new card content with the correct content" do
        patch :update, { id: @remix.id, card: @remix_params }
        @remix.reload
        assert_equal @remix_params[:front], @remix.front
        assert_equal @remix_params[:back], @remix.back
      end
    end

  end
end
