require 'test_helper'

class PublicControllerTest < ActionController::TestCase
  test "should get home" do
    get :home
    assert_response :success
  end

  test "should get browse" do
    get :browse
    assert_response :success
  end

  test "should get showcase" do
    get :showcase
    assert_response :success
  end

end
