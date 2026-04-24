import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMe, getAllUsers, getSimulations } from '../services/api';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get current user', async () => {
    const mockUser = { id: '1', name: 'Test User' };
    mockedAxios.create().get.mockResolvedValueOnce({ data: mockUser });
    
    const result = await getMe();
    expect(result).toEqual(mockUser);
  });

  it('should get all users', async () => {
    const mockUsers = [{ id: '1', name: 'User 1' }, { id: '2', name: 'User 2' }];
    mockedAxios.create().get.mockResolvedValueOnce({ data: mockUsers });
    
    const result = await getAllUsers();
    expect(result).toEqual(mockUsers);
  });

  it('should get simulations', async () => {
    const mockSims = [{ id: 'sim-1', status: 'running' }];
    mockedAxios.create().get.mockResolvedValueOnce({ data: mockSims });
    
    const result = await getSimulations();
    expect(result).toEqual(mockSims);
  });
});