import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageUpload from '../ImageUpload';

describe('ImageUpload', () => {
  const mockOnImageSelect = vi.fn();

  beforeEach(() => {
    mockOnImageSelect.mockClear();
  });

  it('renders upload interface', () => {
    render(<ImageUpload onImageSelect={mockOnImageSelect} preview={null} />);
    expect(screen.getByText(/Upload a file/i)).toBeInTheDocument();
  });

  it('shows preview when image is selected', () => {
    const preview = 'data:image/jpeg;base64,test';
    render(<ImageUpload onImageSelect={mockOnImageSelect} preview={preview} />);
    expect(screen.getByAltText('Preview')).toBeInTheDocument();
  });

  it('allows removing selected image', async () => {
    const user = userEvent.setup();
    const preview = 'data:image/jpeg;base64,test';
    render(<ImageUpload onImageSelect={mockOnImageSelect} preview={preview} />);

    const removeButton = screen.getByText(/Remove/i);
    await user.click(removeButton);

    expect(mockOnImageSelect).toHaveBeenCalledWith(null);
  });
});

