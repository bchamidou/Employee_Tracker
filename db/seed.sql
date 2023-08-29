USE employeesDB;

INSERT INTO department
  (name)
VALUES
  ('Research'),
  ('Engineering'),
  ('Sales'),
  ('Finance'),
  ('Legal'),
  ('Audit');

-- Inserts roles of employee into role table
INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Scientist', 215000, 1),
  ('Software Engineer', 115000, 2),
  ('Salesperson', 85000, 3),
  ('Accountant', 125000, 4),
  ('Lawyer', 150000, 5),
  ('Auditor', 120000, 6);


-- Inserts employee information into employee table
INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Yves', 'Lapin', 1, 12),
  ('Malika', 'Toucouleur', 2, 3),
  ('Sharifa', 'Menhar', 2,null ),
  ('Stephan', 'Zabrasky', 3, 5),
  ('Kako', 'Fenicolapo', 3,null),
  ('Tene', 'Boureimi', 4, 7),
  ('Jack', 'LeChien', 4,null),
  ('Franck', 'Lebossu', 5, 9),
  ('Chen', 'LI', 5,null),
  ('Awa', 'Farida', 6, 11),
  ('Lesli', 'Vermont', 6,null),
  ('Shaban', 'Mouarad', 1,null);