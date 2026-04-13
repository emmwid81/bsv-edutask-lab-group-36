import pytest
from unittest.mock import patch, MagicMock

from src.util.dao import DAO
from src.controllers.usercontroller import UserController

# @pytest.fixture
# def mock_dao():
#     mocked_dao = MagicMock()
#     return mocked_dao

# @pytest.mark.parametrize('email, expected', [(-1, 'invalid'), (0, 'underaged'), (1, 'underaged'), (17, 'underaged'), (18, 'valid'), (19, 'valid'), (119, 'valid'), (120, 'valid'), (121, 'invalid')])
# def test_validateAge(sut, expected):
#     validationresult = sut.validateAge(userid=None)
#     assert validationresult == expected
@pytest.mark.unit
def test_user_controller_1():
    email = 'test@example.com'
    user = {'email' : email}
    mocked_dao = MagicMock()
    mocked_dao.find.return_value = [user]
    user_controller = UserController(mocked_dao)
    result = user_controller.get_user_by_email(email)
    assert result == user

@pytest.mark.unit
def test_user_controller_2():
    email = 'test@example.com'
    user = {'email' : email}
    user2 = {'email': email}
    mocked_dao = MagicMock()
    mocked_dao.find.return_value = [user, user2]
    user_controller = UserController(mocked_dao)
    result = user_controller.get_user_by_email(email)
    assert result == user

@pytest.mark.unit
def test_user_controller_3():
    with pytest.raises(ValueError):
        email = 'invalidemail'
        user = {'email' : email}
        mocked_dao = MagicMock()
        mocked_dao.find.return_value = [user]
        user_controller = UserController(mocked_dao)
        user_controller.get_user_by_email(email)

@pytest.mark.unit
def test_user_controller_4():
    with pytest.raises(ValueError):
        email = 'a@b'
        user = {'email' : email}
        mocked_dao = MagicMock()
        mocked_dao.find.return_value = [user]
        user_controller = UserController(mocked_dao)
        user_controller.get_user_by_email(email)

@pytest.mark.unit
def test_user_controller_5():
    mocked_dao = MagicMock()
    mocked_dao.find.return_value = []
    user_controller = UserController(mocked_dao)
    result = user_controller.get_user_by_email('unknown@email.com')
    assert result == None

@pytest.mark.unit
def test_user_controller_6():
    with pytest.raises(Exception):
        email = 'test@example.com'
        mocked_dao = MagicMock()
        mocked_dao.find.side_effect(Exception)
        user_controller = UserController(mocked_dao)
        user_controller.get_user_by_email(email)