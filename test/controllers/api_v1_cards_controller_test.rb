require 'test_helper'

class Api::V1::CardsControllerTest < ControllerTestCase
  should "get an index" do
    get :index
    assert_equal @user.cards.to_json, response.body
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
      assert_equal Card.last.to_json, response.body
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

    should "update front and back" do
      patch :update, { id: @card.id, card: @card_params }
      @card.reload
      assert_equal @card_params[:front], @card.front
      assert_equal @card_params[:back], @card.back
    end

    should "udpate tags" do
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
