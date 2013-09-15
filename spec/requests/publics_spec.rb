require 'spec_helper'

describe "Publics" do

  describe "Home page" do

    it "should have the content 'Featured Timelines'" do
      visit '/public/home'
      expect(page).to have_content('Featured Timelines')
    end

    it "should have the title 'TimeMelange'" do
      visit '/public/home'
      expect(page).to have_title("TimeMelange")
    end

  end

  describe "Browse page" do

    it "should have the content 'Browse Timelines'" do
      visit '/public/browse'
      expect(page).to have_content('Browse Timelines')
    end
  end

  describe "Showcase page" do

    it "should have the content 'Showcase Timelines'" do
      visit '/public/showcase'
      expect(page).to have_content('Music')
    end
  end

end
