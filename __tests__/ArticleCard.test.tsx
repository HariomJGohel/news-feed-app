/**
 * Component interaction test — ArticleCard
 *
 * Uses @testing-library/react-native to render the component in isolation
 * and verify: visible content, press interaction.
 */

// Mock the icon library — Jest cannot load binary TTF font files
jest.mock('@react-native-vector-icons/ionicons', () => 'IonIcon');

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ArticleCard from '../src/features/feed/components/ArticleCard';
import type { Article } from '../src/shared/types/article';
import { ThemeProvider } from '../src/shared/theme';

const mockArticle: Article = {
  id: 1,
  title: 'React Native is awesome',
  url: 'https://reactnative.dev/blog/awesome',
  domain: 'reactnative.dev',
  faviconUrl: 'https://www.google.com/s2/favicons?domain=reactnative.dev&sz=64',
  author: 'testuser',
  score: 342,
  time: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
};

describe('ArticleCard', () => {
  it('renders article title', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ArticleCard article={mockArticle} onPress={jest.fn()} />
      </ThemeProvider>,
    );
    expect(getByText(mockArticle.title)).toBeTruthy();
  });

  it('renders article domain', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ArticleCard article={mockArticle} onPress={jest.fn()} />
      </ThemeProvider>,
    );
    expect(getByText(mockArticle.domain)).toBeTruthy();
  });

  it('renders article score', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ArticleCard article={mockArticle} onPress={jest.fn()} />
      </ThemeProvider>,
    );
    expect(getByText(mockArticle.score.toString())).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider>
        <ArticleCard
          article={mockArticle}
          onPress={onPress}
          testID={`article-card-${mockArticle.id}`}
        />
      </ThemeProvider>,
    );
    fireEvent.press(getByTestId(`article-card-${mockArticle.id}`));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
